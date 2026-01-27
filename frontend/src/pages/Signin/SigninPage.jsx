import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SigninPage.css';

function SigninPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckUsername = () => {
    // 아이디 중복 체크 API 연동 필요
    console.log('아이디 중복 체크:', formData.username);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 API 연동 필요
    console.log('회원가입 시도:', formData);
  };

  return (
    <div className="signin">
      <div className="signin__container">
        <h1 className="signin__title">회원가입</h1>

        <form className="signin__form" onSubmit={handleSubmit}>
          <div className="signin__field">
            <label className="signin__label" htmlFor="username">
              아이디
            </label>
            <div className="signin__input-group">
              <input
                className="signin__input"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="4~12자 영문 소문자, 숫자"
              />
              <button
                className="signin__check-button"
                type="button"
                onClick={handleCheckUsername}
              >
                중복확인
              </button>
            </div>
          </div>

          <div className="signin__field">
            <label className="signin__label" htmlFor="email">
              이메일
            </label>
            <input
              className="signin__input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
          </div>

          <div className="signin__field">
            <label className="signin__label" htmlFor="password">
              비밀번호
            </label>
            <input
              className="signin__input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8~16자 영문, 숫자"
            />
          </div>

          <div className="signin__field">
            <label className="signin__label" htmlFor="passwordConfirm">
              비밀번호 확인
            </label>
            <input
              className="signin__input"
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          <div className="signin__field">
            <label className="signin__label" htmlFor="name">
              이름
            </label>
            <input
              className="signin__input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
          </div>

          <button className="signin__button" type="submit">
            회원가입
          </button>
        </form>

        <p className="signin__link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default SigninPage;