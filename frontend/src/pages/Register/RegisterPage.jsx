import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ===== API 함수 불러오기 =====
// register: 회원가입 API 함수
// checkUsername: 아이디 중복확인 API 함수
import { register, checkUsername } from '../../api/auth/register';

import './RegisterPage.css';

// ===== 회원가입 페이지 컴포넌트 =====
function RegisterPage() {
  // ----- 페이지 이동을 위한 navigate 함수 -----
  // 회원가입 성공 후 로그인 페이지로 이동할 때 사용
  const navigate = useNavigate();

  // ----- 폼 입력값을 관리하는 상태 -----
  // 사용자가 입력하는 회원정보를 저장
  const [formData, setFormData] = useState({
    username: '',        // ID
    email: '',
    password: '',
    passwordConfirm: '', // 비밀번호 확인
    name: '',
  });

  // ----- 에러 메시지 상태 -----
  // 회원가입 실패 시 사용자에게 보여줄 에러 메시지
  const [error, setError] = useState('');

  // ----- 로딩 상태 -----
  // API 호출 중인지 여부 (버튼 비활성화, "가입 중..." 텍스트 표시에 사용)
  const [loading, setLoading] = useState(false);

  // ----- 아이디 중복확인 관련 상태 -----
  const [usernameChecked, setUsernameChecked] = useState(false);      // usernameChecked: 중복확인 버튼을 눌렀는지 여부
  const [usernameAvailable, setUsernameAvailable] = useState(false);  // usernameAvailable: 아이디 사용 가능 여부
  const [usernameMessage, setUsernameMessage] = useState('');         // usernameMessage: 중복확인 결과 메시지 (아이디 입력칸 아래에 표시)

  // ===== 입력값 변경 핸들러 =====
  // input에 값을 입력할 때마다 호출되는 함수
  const handleChange = (e) => {
    // e.target에서 input의 name과 value를 추출
    const { name, value } = e.target;

    // 이전 상태를 복사하고, 변경된 필드만 업데이트
    setFormData((prev) => ({
      ...prev,        // 기존 값 유지 (스프레드 연산자)
      [name]: value,  // 변경된 필드만 업데이트
    }));

    // 입력할 때 이전 에러 메시지 초기화
    setError('');
    
    // ----- 아이디 필드가 변경되면 중복확인 초기화 -----
    // 아이디를 수정하면 다시 중복확인 받기
    if (name === 'username') {
      setUsernameChecked(false);   // 중복확인 안 함 상태로
      setUsernameAvailable(false); // 사용 불가능 상태로
      setUsernameMessage('');      // 메시지 초기화
    }
  };

  // ===== 아이디 중복확인 핸들러 =====
  // 중복확인 버튼 클릭 시 호출되는 함수
  const handleCheckUsername = async () => {
    // ----- 빈 값 체크 -----
    if (!formData.username) {
      setUsernameMessage('아이디를 입력해주세요.');
      return;
    }

    // ----- 아이디 형식 검사 -----
    // 4~12자 영문 소문자, 숫자만
    const usernameRegex = /^[a-z0-9]{4,12}$/;
    if (!usernameRegex.test(formData.username)) {
      setUsernameMessage('4~12자 영문 소문자, 숫자만 사용 가능합니다.');
      return;
    }

    // ----- API 호출 (try-catch로 에러 처리) -----
    try {
      // checkUsername 함수 호출
      // API 명세: POST /auth/check, 요청: { userId }
      const result = await checkUsername(formData.username);

      // 중복확인 완료 상태로 변경
      setUsernameChecked(true);
      // 사용 가능 여부 저장 (result.noDuplicate가 true면 사용 가능)
      setUsernameAvailable(result.noDuplicate);
      
      // ===== 응답 데이터 구조 =====
      // 성공 (사용 가능): { message: "사용 가능한 아이디입니다.", noDuplicate: true }
      // 실패 (중복):     { message: "이미 존재하는 아이디입니다.", noDuplicate: false }

      // 결과에 따른 메시지 표시
      if (result.noDuplicate) {
        setUsernameMessage('사용 가능한 아이디입니다.');
      } else {
        setUsernameMessage('이미 사용 중인 아이디입니다.');
      }

    } catch (err) {
      // ----- 중복확인 실패 시 에러 처리 -----
      console.error('중복확인 실패:', err);

      // 서버에서 보낸 에러 데이터 추출
      const errorData = err.response?.data;
      
      // 400 에러: 중복된 아이디
      if (err.response?.status === 400) {
        setUsernameChecked(true);
        setUsernameAvailable(false);
        setUsernameMessage(errorData?.message || '이미 존재하는 아이디입니다.');
      } else {
        // 기타 에러
        setUsernameMessage('중복확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // ===== 폼 제출 핸들러 (회원가입 버튼 클릭 시) =====
  const handleSubmit = async (e) => {
    // 폼 기본 동작(페이지 새로고침) 방지
    e.preventDefault();
    
    // 에러 메시지 초기화
    setError('');

    // ===== 유효성 검사 (제출 전 체크) =====
    
    // ----- 아이디 중복확인 체크 -----
    if (!usernameChecked || !usernameAvailable) {
      setError('아이디 중복확인을 해주세요.');
      return;
    }

    // ----- 비밀번호 일치 체크 -----
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // ----- 비밀번호 형식 검사 -----
    // 8~16자 영문, 숫자만 허용
    const passwordRegex = /^[a-zA-Z0-9]{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('비밀번호는 8~16자 영문, 숫자만 사용 가능합니다.');
      return;
    }

    // 로딩 시작
    setLoading(true);

    // ----- API 호출 (try-catch로 에러 처리) -----
    try {
      // register 함수 호출
      // API 명세: POST /api/register
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      // 회원가입 성공 시 콘솔에 결과 출력
      console.log('회원가입 성공:', result);

      // ===== 성공 응답 데이터 구조 (API 명세서 참고) =====
      // {
      //   message: "회원가입이 완료되었습니다",
      //   data: {
      //     userId: 1,                          // 생성된 사용자 고유 번호
      //     createdAt: "2026-01-15T22:50:00"    // 회원가입 일시
      //   }
      // }

      // 성공 메시지 알림 후 로그인 페이지로 이동
      alert(result.message || '회원가입이 완료되었습니다.');
      navigate('/login');

    } catch (err) {
      // ----- 회원가입 실패 시 에러 처리 -----
      console.error('회원가입 실패:', err);

      // 서버에서 보낸 에러 데이터 추출
      const errorData = err.response?.data;

      // ===== 실패 응답 데이터 구조 (API 명세서 참고) =====
      // {
      //   message: "이메일 값이 올바르지 않습니다.",  // 에러 메시지
      //   errorCode: "INVALID_EMAIL"                // 에러 코드
      // }
      // 에러 코드 종류: DUPLICATE_ID, INVALID_EMAIL, WEAK_PASSWORD

      // 에러 메시지 표시
      setError(errorData?.message || '회원가입에 실패했습니다.');

    } finally {
      // ----- 성공/실패 관계없이 항상 실행 -----
      // 로딩 상태 종료
      setLoading(false);
    }
  };

  // ===== 화면 렌더링 =====
  return (
    // 전체 페이지 컨테이너 (배경색, 중앙 정렬)
    <div className="register">
      {/* 회원가입 폼 박스 (흰색 배경, 그림자) */}
      <div className="register__container">

        {/* 페이지 제목 */}
        <h1 className="register__title">회원가입</h1>

        {/* ----- 회원가입 폼 ----- */}
        <form className="register__form" onSubmit={handleSubmit}>

          {/* ===== 아이디 입력 필드 ===== */}
          <div className="register__field">
            <label className="register__label" htmlFor="username">
              아이디
            </label>
            {/* 아이디 입력 + 중복확인 버튼을 가로로 배치 */}
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
              {/* 중복확인 버튼 (type="button"으로 폼 제출 방지) */}
              <button
                className="register__check-button"
                type="button"
                onClick={handleCheckUsername}
              >
                중복확인
              </button>
            </div>
            {/* ----- 중복확인 메시지 (아이디 입력칸 바로 아래) ----- */}
            {/* usernameMessage 값이 있을 때만 렌더링 */}
            {usernameMessage && (
              <p className={`register__username-message ${usernameAvailable ? 'success' : 'error'}`}>
                {usernameMessage}
              </p>
            )}
          </div>

          {/* ===== 이메일 입력 필드 ===== */}
          <div className="register__field">
            <label className="register__label" htmlFor="email">
              이메일
            </label>
            <input
              className="register__input"
              type="email"  // 이메일 형식 검증
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
          </div>

          {/* ===== 비밀번호 입력 필드 ===== */}
          <div className="register__field">
            <label className="register__label" htmlFor="password">
              비밀번호
            </label>
            <input
              className="register__input"
              type="password"  // 비밀번호 숨김 처리
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8~16자 영문, 숫자"
            />
          </div>

          {/* ===== 비밀번호 확인 입력 필드 ===== */}
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

          {/* ===== 이름 입력 필드 ===== */}
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

          {/* ===== 에러 메시지 표시 영역 (회원가입 버튼 위) ===== */}
          {error && <p className="register__error">{error}</p>}

          {/* ===== 회원가입 버튼 ===== */}
          <button className="register__button" type="submit" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        {/* ===== 로그인 링크 ===== */}
        <p className="register__link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>

      </div>
    </div>
  );
}

// 다른 파일에서 import 할 수 있도록 export
export default RegisterPage;