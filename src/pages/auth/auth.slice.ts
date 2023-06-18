import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  loading: false,
  isLogin: Boolean(localStorage.getItem("access_token")),
  firstLogin: false,
  token: "",
  user: {},
  message: "",
  role: ""
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: state => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<AuthState>) => {
      state.loading = false;
      state.isLogin = true;
      state.firstLogin = action.payload.firstLogin;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.user.role;
    },
    loginError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.isLogin = false;
      state.message = action.payload.message;
    },
    logoutSuccess: (state: AuthState) => {
      state.isLogin = false;
      state.token = "";
      state.user = {};
      state.role = "";
    },
    getInfoSuccess: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
    },
    getInfoError: (state, action) => {
      state.user = {};
      state.message = action.payload.message;
    }
  }
});

export const authActions = {
  ...authSlice.actions,
  login: createAction(`${authSlice.name}/login`, (data: any) => ({
    payload: data
  })),
  getInfo: createAction(`${authSlice.name}/getInfo`, (data: any) => ({
    payload: data
  }))
};

const authReducer = authSlice.reducer;
export default authReducer;
