// ===== React 및 필요한 훅(Hook) 불러오기 =====
// useState: 컴포넌트 내에서 상태(state)를 관리하기 위한 훅
import { useState } from 'react';

// Link: 페이지 새로고침 없이 다른 경로로 이동하는 컴포넌트
// useNavigate: 프로그래밍 방식으로 페이지 이동할 때 사용하는 훅
import { Link, useNavigate } from 'react-router-dom';

// ===== API 함수 불러오기 =====
// 로그인 API 함수를 register.js에서 가져옴
import { login } from '../../api/auth/register';

// ===== 스타일 및 이미지 불러오기 =====
import './LoginPage.css';
import logo from './pknu_library_logo.png';

// ===== 로그인 페이지 컴포넌트 =====
function LoginPage() {
  // ----- 페이지 이동을 위한 navigate 함수 -----
  // 로그인 성공 후 메인페이지로 이동할 때 사용
  const navigate = useNavigate();

  // ----- 폼 입력값을 관리하는 상태 -----
  // 사용자가 입력하는 아이디와 비밀번호를 저장
  const [formData, setFormData] = useState({
    username: '',  // ID 입력값
    password: '',  // PW 입력값
  });

  // ----- 에러 메시지 상태 ----- 
  const [error, setError] = useState('');   // 로그인 실패 시 사용자에게 보여줄 에러 메시지

  // ----- 로딩 상태 -----
  const [loading, setLoading] = useState(false);  // API 호출 중인지 여부 (버튼 비활성화, "로그인 중..." 텍스트 표시에 사용)

  // ===== 입력값 변경 핸들러 =====
  // input에 값을 입력할 때마다 호출되는 함수
  const handleChange = (e) => {
    // e.target에서 input의 name과 value를 추출
    // name: input 태그의 name 속성 (username 또는 password)
    // value: 사용자가 입력한 값
    const { name, value } = e.target;

    // 이전 상태(prev)를 복사하고, 변경된 필드만 업데이트
    // [name]: value → 동적으로 key를 설정하는 ES6 문법
    setFormData((prev) => ({
      ...prev,        // 기존 값 유지 (스프레드 연산자)
      [name]: value,  // 변경된 필드만 업데이트
    }));

    // 입력할 때 이전 에러 메시지 초기화
    setError('');
  };

  // ===== 폼 제출 핸들러 (로그인 버튼 클릭 시) =====
  // async: 비동기 함수 선언 (API 호출을 기다려야 하므로)
  const handleSubmit = async (e) => {
    // 폼 기본 동작(페이지 새로고침) 방지
    // <form> 태그는 submit 되면 자동으로 페이지 새로고침 -> 이를 막기 위함
    e.preventDefault();

    // 로딩 시작 & 에러 초기화
    setLoading(true);
    setError('');

    // ----- API 호출 (try-catch로 에러 처리) -----
    try {
      // login 함수 호출
      // await: 응답이 올 때까지 기다림
      const result = await login(formData.username, formData.password);

      // 로그인 성공 시 콘솔에 결과 출력
      // 디버깅용
      console.log('로그인 성공:', result);

      // ===== 성공 응답 데이터 구조 =====
      // {
      //   userId: 102,                        // 사용자 고유 번호
      //   message: "로그인 성공",              // 응답 메시지
      //   role: "USER" 또는 "ADMIN",          // 사용자 권한 등급
      //   expiredAt: "2026-01-17T18:30:00Z",  // 세션 만료 시각
      //   lastLoginAt: "2026-01-17T17:30:00"  // 마지막 로그인 시각
      // }

      // 추후에 해야될 것: 로그인 성공 후 처리
      // 1. 사용자 정보 저장
      // 2. 메인페이지로 이동
      // navigate('/');

    } catch (err) {
      // ----- 로그인 실패 시 에러 처리 -----
      console.error('로그인 실패:', err);

      // 서버에서 보낸 에러 데이터 추출
      const errorData = err.response?.data;

      // ===== 실패 응답 데이터 구조 =====
      // {
      //   message: "비밀번호가 일치하지 않습니다.",  // 에러 메시지
      //   errorCode: "ERR_AUTH_001",               // 에러 코드
      //   loginFailCount: 3                        // 로그인 실패 횟수 (0~5)
      // }

      // ----- 로그인 실패 횟수에 따른 메시지 분기 -----
      if (errorData?.loginFailCount >= 5) {
        // 5회 이상 실패: 계정 잠금 안내
        setError('로그인 5회 실패로 5분간 로그인이 제한됩니다.');
      } else if (errorData?.loginFailCount) {
        // 1~4회 실패: 실패 횟수 표시
        setError(`${errorData.message} (${errorData.loginFailCount}/5회 실패)`);
      } else {
        // 기타 에러: 서버 메시지 또는 기본 메시지
        setError(errorData?.message || '로그인에 실패했습니다.');
      }

    } finally {
      // ----- 성공/실패 관계없이 항상 실행 -----
      // 로딩 상태 종료
      setLoading(false);
    }
  };

  // ===== 화면 렌더링 =====
  return (
    // 전체 페이지 컨테이너 (배경색, 중앙 정렬)
    <div className="login">
      {/* 로그인 폼 박스 (흰색 배경, 그림자) */}
      <div className="login__container">

        {/* 부경대학교 도서관 로고 */}
        <img src={logo} alt="부경대학교 도서관" className="login__logo" />

        {/* 페이지 제목 */}
        <h1 className="login__title">로그인</h1>

        {/* ----- 로그인 폼 ----- */}
        {/* onSubmit: 폼 제출 시 handleSubmit 함수 실행 */}
        <form className="login__form" onSubmit={handleSubmit}>

          {/* ===== 아이디 입력 필드 ===== */}
          <div className="login__field">
            {/* htmlFor: label 클릭 시 해당 input에 포커스 */}
            <label className="login__label" htmlFor="username">
              아이디
            </label>
            <input
              className="login__input"
              type="text"
              id="username"          // label의 htmlFor와 연결
              name="username"        // handleChange에서 이 값으로 상태 업데이트
              value={formData.username}  // 상태와 연결 (제어 컴포넌트)
              onChange={handleChange}    // 입력 시 상태 업데이트
              placeholder="아이디를 입력하세요"
            />
          </div>

          {/* ===== 비밀번호 입력 필드 ===== */}
          <div className="login__field">
            <label className="login__label" htmlFor="password">
              비밀번호
            </label>
            <input
              className="login__input"
              type="password"        // 비밀번호 숨김 처리
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* ===== 에러 메시지 표시 영역 ===== */}
          {/* error 값이 있을 때만 렌더링 (조건부 렌더링) */}
          {error && <p className="login__error">{error}</p>}

          {/* ===== 로그인 버튼 ===== */}
          {/* disabled: loading 중이면 버튼 비활성화 */}
          <button className="login__button" type="submit" disabled={loading}>
            {/* 로딩 중이면 "로그인 중...", 아니면 "로그인" 표시 */}
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* ===== 회원가입 링크 ===== */}
        <p className="login__link">
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </p>

      </div>
    </div>
  );
}

// 다른 파일에서 import 할 수 있도록 export
export default LoginPage;