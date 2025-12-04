import styled from "styled-components";

export const NavBarContainer = styled.div`
  width: 100%;
  min-height: 80px;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

export const NavbarContent = styled.div`
  width: 90%;
  max-width: 1400px;
  min-height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;

  @media screen and (max-width: 960px) {
    width: 100%;
    padding: 0 1rem;
  }
`;

export const NavBarLogo = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
`;

export const NavBarText = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  color: white;
  transition: all 0.3s ease;

  @media screen and (max-width: 660px) {
    font-size: 1.2rem;
  }
`;

export const AccountInfoBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 230px;
  background: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  @media screen and (max-width: 600px) {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
  }
`;

export const AccountInfo = styled.span`
  font-size: 0.9rem;
  color: #1e3a8a;
  font-weight: 500;
  font-family: "Inter", sans-serif;
`;

export const LiveContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f2f5;
  padding: 2rem 0;
`;

export const Wrapper = styled.div`
  width: 90%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media screen and (max-width: 960px) {
    width: 95%;
    padding: 1rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const PageTitle = styled.div`
  font-size: 2rem;
  font-weight: 700;
  font-family: "Inter", sans-serif;
  color: #1e3a8a;
  animation: slideIn 0.5s ease;

  @keyframes slideIn {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media screen and (max-width: 960px) {
    font-size: 1.5rem;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const HeaderButtons = styled.button`
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  color: white;
  font-size: 1rem;
  font-family: "Inter", sans-serif;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
  }

  @media screen and (max-width: 600px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
`;

export const FirstRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
`;

export const LongColumn = styled.div`
  flex: 2;
  min-width: 300px;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-in;

  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

export const BarGraphContainer = styled.div`
  width: 100%;
`;

export const ShortColumn = styled.div`
  flex: 1;
  min-width: 300px;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-in 0.2s;

  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

export const SecondRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem 1rem;
`;

export const LastFetech = styled.div`
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  color: #4b5563;
  font-style: italic;
`;

export const LastRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
`;

export const SectionTitle = styled.h1`
  font-size: 1.5rem;
  font-family: "Inter", sans-serif;
  color: #1e3a8a;
  margin-bottom: 1rem;
  animation: slideIn 0.5s ease;

  @media screen and (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
`;

export const Card = styled.div`
  flex: 1;
  min-width: 200px;
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: cardPop 0.5s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  @keyframes cardPop {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const CardImg = styled.img`
  width: 100%;
  max-width: 150px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin: 0 auto 1rem;
  display: block;
`;

export const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  color: #374151;
`;

export const LeadingSectionContainer = styled.div`
  width: 100%;
  padding: 0;
`;

export const LineCardContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
