// src/lib/firebase.ts

/**
 * Firebase 서비스 설정 및 유틸리티 함수
 * 인증, 스토리지, 데이터베이스 등의 Firebase 기능을 제공합니다.
 */

// Firebase 앱 초기화 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 활성화 여부 (환경 변수에 따라 결정)
const isFirebaseEnabled = Boolean(import.meta.env.VITE_ENABLE_FIREBASE);

// Firebase 서비스 객체
let auth: any = null;
let firestore: any = null;
let storage: any = null;
let analytics: any = null;
let app: any = null;

// Firebase 서비스 초기화 플래그
let isInitialized = false;

/**
 * Firebase 서비스 초기화
 * Firebase 모듈을 동적으로 가져와서 초기화합니다.
 */
export const initializeFirebase = async (): Promise<void> => {
  // Firebase가 비활성화되어 있거나 이미 초기화된 경우 스킵
  if (!isFirebaseEnabled || isInitialized) {
    return;
  }

  try {
    // Firebase 모듈 동적 임포트
    const firebase = await import('firebase/app');

    // Firebase 앱 초기화
    app = firebase.initializeApp(firebaseConfig);

    // Firebase 인증 초기화
    const authModule = await import('firebase/auth');
    auth = authModule.getAuth(app);

    // Firebase Firestore 초기화
    const firestoreModule = await import('firebase/firestore');
    firestore = firestoreModule.getFirestore(app);

    // Firebase Storage 초기화
    const storageModule = await import('firebase/storage');
    storage = storageModule.getStorage(app);

    // Firebase Analytics 초기화 (브라우저 환경에서만)
    if (typeof window !== 'undefined') {
      const analyticsModule = await import('firebase/analytics');
      analytics = analyticsModule.getAnalytics(app);
    }

    isInitialized = true;
    console.log('Firebase initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
};

/**
 * Firebase 서비스 확인
 * Firebase가 초기화되었는지 확인하고, 초기화되지 않은 경우 에러를 발생시킵니다.
 */
const checkFirebaseInitialized = (): void => {
  if (!isFirebaseEnabled) {
    throw new Error('Firebase is disabled in this environment.');
  }

  if (!isInitialized) {
    throw new Error('Firebase has not been initialized. Call initializeFirebase() first.');
  }
};

/**
 * Firebase 인증 서비스 사용자 로그인
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 */
export const signInWithEmailAndPassword = async (email: string, password: string): Promise<any> => {
  checkFirebaseInitialized();
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Firebase 인증 서비스 사용자 회원가입
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 */
export const createUserWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<any> => {
  checkFirebaseInitialized();
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Firebase 인증 서비스 사용자 로그아웃
 */
export const signOut = async (): Promise<void> => {
  checkFirebaseInitialized();
  const { signOut } = await import('firebase/auth');
  return signOut(auth);
};

/**
 * Firebase Storage 파일 업로드
 * @param path 저장 경로
 * @param file 업로드할 파일
 */
export const uploadFile = async (path: string, file: File): Promise<string> => {
  checkFirebaseInitialized();
  const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

  // 저장소 참조 생성
  const storageRef = ref(storage, path);

  // 파일 업로드
  const uploadResult = await uploadBytes(storageRef, file);

  // 다운로드 URL 가져오기
  const downloadURL = await getDownloadURL(uploadResult.ref);
  return downloadURL;
};

/**
 * Firebase Analytics 이벤트 로깅
 * @param eventName 이벤트 이름
 * @param eventParams 이벤트 파라미터
 */
export const logEvent = (eventName: string, eventParams?: Record<string, any>): void => {
  if (!isFirebaseEnabled || !isInitialized || !analytics) {
    return;
  }

  const { logEvent } = require('firebase/analytics');
  logEvent(analytics, eventName, eventParams);
};

// Firebase 서비스 객체 내보내기
export default {
  initializeFirebase,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  uploadFile,
  logEvent,
  get app() {
    checkFirebaseInitialized();
    return app;
  },
  get auth() {
    checkFirebaseInitialized();
    return auth;
  },
  get firestore() {
    checkFirebaseInitialized();
    return firestore;
  },
  get storage() {
    checkFirebaseInitialized();
    return storage;
  },
  get analytics() {
    checkFirebaseInitialized();
    return analytics;
  },
};
