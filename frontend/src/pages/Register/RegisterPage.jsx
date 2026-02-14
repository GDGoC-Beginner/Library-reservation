// src/pages/RegisterPage/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ===== API 함수 불러오기 =====
import { register, checkUsername } from '../../api/auth/register';

import './RegisterPage.css';

// ===== 회원가입 페이지 컴포넌트 =====
function RegisterPage() {
  const navigate = useNavigate();

  // ----- 폼 입력값 -----
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
  });

  // ----- 에러/로딩 -----
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ----- 아이디 중복확인 상태 -----
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');

  // ===== 입력값 변경 핸들러 =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');

    // 아이디 변경 시 중복확인 초기화
    if (name === 'username') {
      setUsernameChecked(false);
      setUsernameAvailable(false);
      setUsernameMessage('');
    }
  };

  // ===== 아이디 중복확인 핸들러 =====
  const handleCheckUsername = async () => {
    // 빈 값 체크
    if (!formData.username) {
      setUsernameMessage('아이디를 입력해주세요.');
      setUsernameAvailable(false);
      setUsernameChecked(false);
      return;
    }

    // 아이디 형식 검사: 4~12자 영문 소문자, 숫자만
    const usernameRegex = /^[a-z0-9]{4,12}$/;
    if (!usernameRegex.test(formData.username)) {
      setUsernameMessage('4~12자 영문 소문자, 숫자만 사용 가능합니다.');
      setUsernameAvailable(false);
      setUsernameChecked(false);
      return;
    }

    try {
      // API 호출 (POST /auth/check, 요청: { userId })
      const result = await checkUsername(formData.username);
      const isAvailable = result?.available === true;

      setUsernameChecked(true);
      setUsernameAvailable(isAvailable);

      // 서버 메시지 우선 사용
      setUsernameMessage(
        result?.message ||
          (isAvailable
            ? '사용 가능한 아이디입니다.'
            : '이미 사용 중인 아이디입니다.')
      );
    } catch (err) {
      console.error('중복확인 실패:', err);

      const errorData = err.response?.data;

      // 서버가 상태코드로 중복/실패를 구분하는 경우 대비
      if (err.response?.status === 400) {
        setUsernameChecked(true);
        setUsernameAvailable(false);
        setUsernameMessage(errorData?.message || '이미 존재하는 아이디입니다.');
      } else {
        setUsernameChecked(false);
        setUsernameAvailable(false);
        setUsernameMessage('중복확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // ===== 폼 제출 핸들러 =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 아이디 중복확인 체크
    if (!usernameChecked || !usernameAvailable) {
      setError('아이디 중복확인을 해주세요.');
      return;
    }

    // 비밀번호 일치 체크
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 형식 검사: 8~16자 영문, 숫자만
    const passwordRegex = /^[a-zA-Z0-9]{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('비밀번호는 8~16자 영문, 숫자만 사용 가능합니다.');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      console.log('회원가입 성공:', result);

      alert(typeof result === "string" ? result : (result?.message || "회원가입이 완료되었습니다."));
      navigate('/login');
    } catch (err) {
      console.error('회원가입 실패:', err);
      const errorData = err.response?.data;
      setError(errorData?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ===== 화면 렌더링 =====
  return (
    <div className="register">
      <div className="register__container">
        <h1 className="register__title">회원가입</h1>

        <form className="register__form" onSubmit={handleSubmit}>
          {/* ===== 아이디 ===== */}
          <div className="register__field">
            <label className="register__label" htmlFor="username">
              아이디
            </label>

            <div className="register__input-group">
              <input
                className="register__input"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="4~12자 영문 소문자, 숫자"
              />
              <button
                className="register__check-button"
                type="button"
                onClick={handleCheckUsername}
                disabled={loading}
              >
                중복확인
              </button>
            </div>

            {usernameMessage && (
              <p
                className={`register__username-message ${
                  usernameAvailable ? 'success' : 'error'
                }`}
              >
                {usernameMessage}
              </p>
            )}
          </div>

          {/* ===== 이메일 ===== */}
          <div className="register__field">
            <label className="register__label" htmlFor="email">
              이메일
            </label>
            <input
              className="register__input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
          </div>

          {/* ===== 비밀번호 ===== */}
          <div className="register__field">
            <label className="register__label" htmlFor="password">
              비밀번호
            </label>
            <input
              className="register__input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8~16자 영문, 숫자"
            />
          </div>

          {/* ===== 비밀번호 확인 ===== */}
          <div className="register__field">
            <label className="register__label" htmlFor="passwordConfirm">
              비밀번호 확인
            </label>
            <input
              className="register__input"
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          {/* ===== 이름 ===== */}
          <div className="register__field">
            <label className="register__label" htmlFor="name">
              이름
            </label>
            <input
              className="register__input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
          </div>

          {error && <p className="register__error">{error}</p>}

          <button className="register__button" type="submit" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="register__link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
