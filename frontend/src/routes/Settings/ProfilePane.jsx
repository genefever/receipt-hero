import React, { useState, useCallback, useContext, useRef } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Input from "../../components/Input";
import Cropper from "react-easy-crop";
import { getOrientation } from "get-orientation/browser";
import { getCroppedImage, getRotatedImage } from "./canvasUtils";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";
import { StyledButton } from "../../components/Button";
import { StyledModal } from "../../components/Modal";
import { ThemeContext } from "styled-components";
import { MdEdit } from "react-icons/md";
import {
  createAvatarComponent,
  SrcSource,
  GoogleSource,
  FacebookSource,
  ValueSource,
} from "react-avatar";

const Avatar = createAvatarComponent({
  sources: [SrcSource, GoogleSource, FacebookSource, ValueSource], // image fallback order
});

const ORIENTATION_TO_ANGLE = {
  "3": 180,
  "6": 90,
  "8": -90,
};

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

function ProfilePane(props) {
  const [imageSource, setImageSource] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();
  const [showModal, setShowModal] = useState(false);
  const themeContext = useContext(ThemeContext);
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024; // in MiB

      // Check file size is under 1 MB.
      if (fileSize > 1) {
        props.setErrorMessage("Picture must be smaller than 1 MB.");
        e.target.value = null;
      } else {
        let imageDataUrl = await readFile(file);

        // apply rotation if needed
        const orientation = await getOrientation(file);
        const rotation = ORIENTATION_TO_ANGLE[orientation];
        if (rotation) {
          imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
        }

        setImageSource(imageDataUrl);
        setShowModal(true);
      }
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const setCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImage(
        imageSource,
        croppedAreaPixels
      );

      props.handleChangeImage(croppedImage);
    } catch (e) {
      // TODO
      console.error(e);
    }
  }, [props, imageSource, croppedAreaPixels]);

  function handleCloseModal() {
    setImageSource();
    setShowModal(false);
  }

  const editImageButtonStyle = {
    border: "1px solid" + themeContext.borderColor,
    background: themeContext.body,
    color: themeContext.text,
    position: "absolute",
    bottom: 0,
    right: -10,
    borderRadius: "10%",
  };

  return (
    <>
      <Form.Group>
        <div style={{ display: "inline-block", position: "relative" }}>
          <Avatar
            size={150}
            src={props.userSettings.profileImage}
            googleId={props.userObject.googleId}
            facebookId={props.userObject.facebookId}
            name={`${props.userSettings.firstName} ${props.userSettings.lastName}`}
            round={true}
            className="my-2"
          />

          <StyledButton
            style={editImageButtonStyle}
            className="py-0 px-1"
            size="sm"
            onClick={(e) => {
              // Programatically click the hidden file input element
              // when the Button component is clicked
              hiddenFileInput.current.click();
            }}
          >
            <div className="d-flex align-items-center">
              <MdEdit className="mr-1" /> Edit
            </div>
          </StyledButton>
          <Form.File
            accept="image/*"
            onChange={handleFileChange}
            ref={hiddenFileInput}
            hidden
          />
        </div>
      </Form.Group>
      <Form.Row>
        <Col lg={5} md={6} sm={8}>
          <Input
            label="First Name"
            required
            name="firstName"
            value={props.userSettings.firstName}
            handleChange={props.handleChange}
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col lg={5} md={6} sm={8}>
          <Input
            label="Last Name"
            required
            name="lastName"
            value={props.userSettings.lastName}
            handleChange={props.handleChange}
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col lg={5} md={6} sm={8}>
          <Input
            label="Email"
            required
            name="email"
            value={props.userSettings.email}
            handleChange={props.handleChange}
          />
        </Col>
      </Form.Row>

      {/* Modal - Crop image */}
      <StyledModal show={showModal} onHide={handleCloseModal}>
        <StyledModal.Header closeButton>
          <StyledModal.Title as={"h5"}>
            Crop your new profile picture
          </StyledModal.Title>
        </StyledModal.Header>
        <StyledModal.Body>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 400,
              background: themeContext.borderColor,
            }}
          >
            <Cropper
              image={imageSource}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Form.Group
              as={Row}
              style={{ display: "flex", flex: "1", alignItems: "center" }}
            >
              <Form.Label column sm="4">
                Zoom
              </Form.Label>
              <Col sm="8">
                <RangeSlider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e, zoom) => setZoom(zoom)}
                  tooltip="off"
                  variant="success"
                  style={{ padding: "22px 0px", marginLeft: 16 }}
                />
              </Col>
            </Form.Group>
          </div>
          <StyledButton
            variant="success"
            onClick={() => {
              setCroppedImage();
              handleCloseModal();
            }}
            block
          >
            Done
          </StyledButton>
        </StyledModal.Body>
      </StyledModal>
    </>
  );
}

export default ProfilePane;
