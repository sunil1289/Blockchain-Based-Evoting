import React, { useState } from "react";
import styled from "styled-components";
import { RiDashboardLine } from "react-icons/ri";
import { FaUserEdit, FaVoteYea } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { IoMdChatboxes } from "react-icons/io";
import { MdSupportAgent, MdDeveloperMode } from "react-icons/md";
import { Link } from "react-router-dom";
import WalletImg from "../Homepage/images/forotp.svg";
import axios from "axios";
import Navbar from "../Layouts/Navbar";

const MainContainer = styled.div`
  height: auto;
  display: flex;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 400px;
  border: 2px solid #01bf71;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const WalletIdText = styled.p`
  word-wrap: break-word;
`;

const GetWalletId = () => {
  const [walletId, setWalletId] = useState("");
  const getemail = sessionStorage.getItem("email");
  console.log(getemail);
  const values = {
    email: getemail,
  };

  const BASE_API_URL = "http://localhost:4000/api/wallet/allmetaids";

  const onSubmitHandler = (values) => {
    console.log(values);
    axios
      .post(BASE_API_URL, values, {
        "Content-Type": "application/json",
      })
      .then((response) => {
        console.log(response);
        if (response.data.status) {
          setWalletId(response.data.metakey);
        } else {
          setWalletId("Unknown Error Occured");
        }
      });
  };
  return (
    <div>
      <Navbar />
      <MainContainer>
        <div className="sidebar col-12 col-lg-3 col-md-5 col-sm-6">
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/dashboard" className="link d-block">
                <RiDashboardLine />
                <span className="mx-3 py-2">Dashboard</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/profile" className="link d-block">
                <FaUserEdit />
                <span className="mx-3 py-2">User</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/vote" className="link d-block">
                <FaVoteYea />
                <span className="mx-3 py-2">Vote</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/walletid" className="link d-block">
                <ImStatsBars />
                <span className="mx-3 py-2">Wallet Id</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/chat" className="link d-block">
                <IoMdChatboxes />
                <span className="mx-3 py-2">Message</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/support" className="link d-block">
                <MdSupportAgent />
                <span className="mx-3 py-2">Support</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/developers" className="link d-block">
                <MdDeveloperMode />
                <span className="mx-3 py-2">Developers</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-9 col-md-7 col-sm-6 py-3">
          <Container>
            <FormContainer className="p-3">
              <img
                src={WalletImg}
                className="img-fluid p-2 mb-2"
                alt="wallet"
              />
              <div className="d-flex align-items-center justify-content-center">
                <label className="w-25 text-center">Your Email</label>
                <input
                  type="text"
                  className="w-75 p-1 pl-0 border border-success rounded text-secondary"
                  value={getemail}
                />
              </div>
              <button
                className="btn btn-success my-3 d-block w-50 mx-auto border border-success rounded"
                onClick={() => {
                  onSubmitHandler();
                }}
              >
                Get Wallet Key
              </button>
              {walletId && (
                <p className="text-center">Your Walley Private key is</p>
              )}
              <WalletIdText className="w-75 text-center">
                {walletId}
              </WalletIdText>
            </FormContainer>
          </Container>
        </div>
      </MainContainer>
    </div>
  );
};

export default GetWalletId;
