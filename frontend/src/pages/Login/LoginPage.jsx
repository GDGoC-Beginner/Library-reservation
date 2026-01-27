import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import logo from './pknu_library_logo.png';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API 연동 필요
    console.log('로그인 시도:', formData);
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} alt="부경대학교 도서관" className="login__logo" />
        <h1 className="login__title">로그인</h1>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label className="login__label" htmlFor="username">
              아이디
            </label>
            <input
              className="login__input"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="password">
              비밀번호
            </label>
            <input
              className="login__input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button className="login__button" type="submit">
            로그인
          </button>
        </form>

        <p className="login__link">
          계정이 없으신가요? <Link to="/signin">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;