// ===== React 및 필요한 훅(Hook) 불러오기 =====
import { useState } from 'react';

// Link: 페이지 새로고침 없이 다른 경로로 이동하는 컴포넌트
// useNavigate: 프로그래밍 방식으로 페이지 이동할 때 사용하는 훅
import { Link, useNavigate } from 'react-router-dom';

// ===== API 함수 불러오기 =====
// 로그인 API 함수를 register.js에서 가져옴
import { login } from '../../api/auth/register';

// ===== 스타일 및 이미지 불러오기 =====
import './LoginPage.css';
import logo from '@/assets/pknu_library_logo.png';

// ===== 로그인 페이지 컴포넌트 =====
function LoginPage() {
  // ----- 페이지 이동을 위한 navigate 함수 -----
  const navigate = useNavigate();

  // ----- 폼 입력값 상태 -----
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // ----- 에러 메시지 -----
  const [error, setError] = useState('');

  // ----- 로딩 상태 -----
  const [loading, setLoading] = useState(false);

  // ===== 입력값 변경 핸들러 =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  // ===== 로그인 제출 =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);

      console.log('로그인 성공:', result);

      // ✅ 로그인 성공 후 메인 페이지로 이동
      navigate('/');

    } catch (err) {
      console.error('로그인 실패:', err);

      const errorData = err.response?.data;

      if (errorData?.loginFailCount >= 5) {
        setError('로그인 5회 실패로 5분간 로그인이 제한됩니다.');
      } else if (errorData?.loginFailCount) {
        setError(`${errorData.message} (${errorData.loginFailCount}/5회 실패)`);
      } else {
        setError(errorData?.message || '로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== 화면 =====
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

          {error && <p className="login__error">{error}</p>}

          <button className="login__button" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="login__link">
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
