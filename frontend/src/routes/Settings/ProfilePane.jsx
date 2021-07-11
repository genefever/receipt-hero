import React, { useState, useCallback, useContext, useRef } from "react";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import { FormTextField } from "../../components/Form";
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

// Formik validation schema
const validationSchema = yup.object({
  firstName: yup
    .string()
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  lastName: yup
    .string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  email: yup.string().email("Invalid email address").required("Required"),
  profileImage: yup.mixed(),
});

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

function ProfilePane(props) {
  const themeContext = useContext(ThemeContext);
  const [imageSource, setImageSource] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();
  const [showModal, setShowModal] = useState(false); // "Crop Image" modal
  // Toggle dropdown on hover
  const [showDropdown, setShowDropdown] = useState(false);
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);
  const formRef = useRef(); // Attached to <Formik>

  const editImageButtonStyle = {
    border: "1px solid" + themeContext.borderColor,
    background: themeContext.body,
    color: themeContext.text,
    position: "absolute",
    bottom: 0, // 10 for left
    right: 0, // 140 for left
    borderRadius: "10%",
  };

  const defaultUserSettings = {
    firstName: props.userObject.firstName,
    lastName: props.userObject.lastName,
    email: props.userObject.email,
    profileImage: props.userObject.profileImage,
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024; // in MiB

      // Check file size is under 1 MB.
      if (fileSize > 1) {
        props.setErrorMessage("Please upload a picture smaller than 1 MB.");
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

      e.target.value = null; // Clear the file from the file input
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

      // Sets Formik "profileImage" key.
      formRef.current.setFieldValue("profileImage", croppedImage, false);
    } catch (err) {
      if (err.response?.data?.message) {
        props.setErrorMessage(err.response.data.message);
      } else {
        props.setErrorMessage("An unexpected error occurred.");
      }
    }
  }, [props, imageSource, croppedAreaPixels]);

  function handleCloseModal() {
    setImageSource();
    setShowModal(false);
  }

  return (
    <>
      <Formik
        validationSchema={validationSchema}
        initialValues={defaultUserSettings}
        innerRef={formRef}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.handleSubmitUserSettings(values).then(() => {
            setSubmitting(false);
          });
        }}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col xs={{ span: 12, order: 2 }} md={{ span: 7, order: 1 }}>
                {/* First Name */}
                <FormTextField label="First Name" name="firstName" />

                {/* Last Name */}
                <FormTextField label="Last Name" name="lastName" />

                {/* Email */}
                <FormTextField label="Email" name="email" />
              </Col>
              <Col xs={{ span: 12, order: 1 }} md={{ span: 5, order: 2 }}>
                <Form.Group>
                  <Form.Label>Profile Image</Form.Label>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Avatar
                      size={200}
                      src={values.profileImage}
                      googleId={props.userObject.google?.id}
                      facebookId={props.userObject.facebook?.id}
                      name={`${props.userObject.firstName} ${props.userObject.lastName}`}
                      round={true}
                      className="my-2"
                      style={{ flex: "0 0 auto" }} // Prevents crushing Avatar circle on shrink.
                    />
                    <Dropdown
                      show={showDropdown}
                      onMouseEnter={() => {
                        setShowDropdown(true);
                      }}
                      onMouseLeave={() => {
                        setShowDropdown(false);
                      }}
                    >
                      <Dropdown.Toggle
                        style={editImageButtonStyle}
                        bsPrefix="py-0 px-1"
                      >
                        <div className="d-flex align-items-center">
                          <MdEdit className="mr-1" /> Edit
                        </div>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={(e) => {
                            // Programatically click the hidden file input element
                            // when the Button component is clicked
                            hiddenFileInput.current.click();
                          }}
                        >
                          Upload a photo
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={(e) => {
                            e.preventDefault();
                            if (
                              window.confirm(
                                "Are you sure you want to reset your current avatar?"
                              )
                            ) {
                              setFieldValue("profileImage", null, false);
                            }
                          }}
                        >
                          Revert to original
                        </Dropdown.Item>
                      </Dropdown.Menu>
                      <Form.File
                        accept="image/*"
                        name="profileImage"
                        onChange={handleFileChange}
                        ref={hiddenFileInput}
                        hidden
                      />
                    </Dropdown>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {/* Save Button */}
            <StyledButton
              $primary
              type="submit"
              className="mt-2"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Save"}
            </StyledButton>
          </Form>
        )}
      </Formik>
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
