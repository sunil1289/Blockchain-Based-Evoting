import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  FormButton,
  FormContent,
  FormLabel,
  FormWrap,
  Icon,
  ImageWrapper,
  PreviewImage,
  UploadButton,
  UploadText,
  InputWrapper,
  InputCol1,
  InputCol2,
  FormInput,
  Form,
} from "./EditCandidateElements";
import { BiImageAdd } from "react-icons/bi";

const EditCandidate = ({ candidate, editFunction }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [candidateName, setCandidateName] = useState(candidate.name);
  const [candidateParty, setCandidateParty] = useState(candidate.party);
  const [candidateDOB, setCandidateDOB] = useState(candidate.dob);
  const [candidateEmail, setCandidateEmail] = useState(candidate.email);
  const [candidateCitizenNo, setCandidateCitizenNo] = useState(
    candidate.citizenshipNo
  );

  const fileInputRef = useRef();

  useEffect(() => {
    const readImage = () => {
      if (image) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(image);
      } else {
        setPreview(null);
      }
    };

    readImage();
  }, [image]);

  const submitHandler = (e) => {
    e.preventDefault();
    editFunction(
      candidate.id,
      candidateName,
      candidateParty,
      candidateCitizenNo,
      candidateDOB,
      candidateEmail
    );
  };

  return (
    <Container>
      <FormWrap>
        <Icon to="#">Edit Candidate</Icon>
        <FormContent>
          <Form onSubmit={submitHandler}>
            <ImageWrapper>
              <FormLabel>Photo:</FormLabel>
              <div style={{ display: "flex", alignItems: "center" }}>
                {preview ? (
                  <PreviewImage
                    src={preview}
                    alt="Preview"
                    style={{ marginRight: "10px" }}
                  />
                ) : (
                  <PreviewImage
                    src={candidate.img}
                    alt="Current"
                    style={{ marginRight: "10px" }}
                  />
                )}
                <UploadButton
                  onClick={() => fileInputRef.current.click()}
                  type="button"
                >
                  <BiImageAdd size={24} />
                  <UploadText>Upload New</UploadText>
                </UploadButton>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
            </ImageWrapper>

            <InputWrapper>
              <InputCol1>
                <FormLabel>Full Name:</FormLabel>
                <FormInput
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  required
                />

                <FormLabel>E-mail:</FormLabel>
                <FormInput
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  required
                />

                <FormLabel>Party:</FormLabel>
                <FormInput
                  type="text"
                  value={candidateParty}
                  onChange={(e) => setCandidateParty(e.target.value)}
                  required
                />
              </InputCol1>

              <InputCol2>
                <FormLabel>Candidate Id:</FormLabel>
                <FormInput type="text" value={candidate.id} readOnly />

                <FormLabel>Citizenship No:</FormLabel>
                <FormInput
                  type="text"
                  value={candidateCitizenNo}
                  onChange={(e) => setCandidateCitizenNo(e.target.value)}
                  required
                />

                <FormLabel>Date of Birth:</FormLabel>
                <FormInput
                  type="text"
                  value={candidateDOB}
                  onChange={(e) => setCandidateDOB(e.target.value)}
                  required
                />
              </InputCol2>
            </InputWrapper>

            <FormButton type="submit">Submit</FormButton>
          </Form>
        </FormContent>
      </FormWrap>
    </Container>
  );
};

export default EditCandidate;
