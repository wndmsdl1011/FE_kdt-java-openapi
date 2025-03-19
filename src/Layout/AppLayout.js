import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import styled from "styled-components";
import { Outlet, Link } from "react-router-dom";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  flex: 1; /* 컨텐츠가 가변적으로 차지할 수 있도록 설정 */
  padding: 20px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 20px;
`;

const Footer = styled.footer`
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 10px;
  margin-top: 20px;
`;

const StyledNavbar = styled(Navbar)`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  padding: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const AppLayout = () => {
  return (
    <LayoutWrapper>
      {/* 네비게이션 바 */}
      <StyledNavbar variant="dark" expand="lg">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{ fontWeight: "bold", fontSize: "24px" }}
          >
            🚨 재난 & 뉴스 알리미
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/"
                style={{ fontWeight: "500", fontSize: "18px" }}
              >
                홈
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/news"
                style={{ fontWeight: "500", fontSize: "18px" }}
              >
                📰 뉴스
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/disaster"
                style={{ fontWeight: "500", fontSize: "18px" }}
              >
                ⚠️ 재난 문자
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>

      {/* 메인 컨텐츠 */}
      <Container>
        <MainContent>
          <Outlet /> {/* 현재 라우트의 컴포넌트가 여기에 표시됨 */}
        </MainContent>
      </Container>

      {/* 푸터 */}
      <Footer>
        <Container>
          <p>© 2025 재난 & 뉴스 알리미. 모든 권리 보유.</p>
        </Container>
      </Footer>
    </LayoutWrapper>
  );
};

export default AppLayout;
