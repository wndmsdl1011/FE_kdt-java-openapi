import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap"; // Navbar, Nav 추가
import { Link, Outlet } from "react-router-dom"; // Link, Outlet 추가
import styled from "styled-components";
import { FaYoutube, FaGithub } from "react-icons/fa"; // 아이콘 추가

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

const StyledNavbar = styled(Navbar)`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  padding: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const FooterWrapper = styled.footer`
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid #ddd;

  .nav {
    justify-content: center;
    padding: 0;
  }

  .nav-item {
    margin: 0 10px;
  }

  .nav-item a {
    color: white;
    font-size: 18px;
    text-decoration: none;
  }

  .footer-text {
    margin-bottom: 10px;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <div className="footer-text">
          <h4>재기알조</h4>
          <p>Copyright &copy; KDT 3기 JAVA OpenAPI 5조</p>
        </div>
        <ul className="nav">
          {/* YouTube 링크 */}
          <li className="nav-item">
            <a
              href="https://www.youtube.com/"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube size={30} />
            </a>
          </li>

          {/* GitHub 링크 */}
          <li className="nav-item">
            <a
              href="https://github.com/wndmsdl1011/FE_kdt-java-openapi.git"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={30} />
            </a>
          </li>

          {/* 재난 관련 링크 */}
          <li className="nav-item">
            <a
              href="https://www.safetydata.go.kr"
              aria-label="Safety Data"
              target="_blank"
              rel="noopener noreferrer"
            >
              재난 데이터
            </a>
          </li>
          <li className="nav-item">
            <a
              href="https://www.mois.go.kr"
              aria-label="행정안전부"
              target="_blank"
              rel="noopener noreferrer"
            >
              행정안전부 재난안전대책본부
            </a>
          </li>
          <li className="nav-item">
            <a
              href="https://www.weather.go.kr"
              aria-label="기상청"
              target="_blank"
              rel="noopener noreferrer"
            >
              기상청 재난 정보
            </a>
          </li>
        </ul>
      </Container>
    </FooterWrapper>
  );
};

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
      <Footer />
    </LayoutWrapper>
  );
};

export default AppLayout;
