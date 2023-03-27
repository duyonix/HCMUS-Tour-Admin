import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  isLogin: Boolean(localStorage.getItem("access_token")),
  token: "",
  user: {},
  message: "",
  role: ""
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthState>) => {
      state.isLogin = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.user.role;
    },
    loginError: (state, action: PayloadAction<any>) => {
      state.isLogin = false;
      state.message = action.payload.message;
    },
    logoutSuccess: (state: AuthState) => {
      state.isLogin = false;
      state.token = "";
      state.user = {};
      state.role = "";
    }
  }
});

export const authActions = {
  ...authSlice.actions,
  login: createAction(`${authSlice.name}/login`, (data: any) => ({
    payload: data
  }))
};

const authReducer = authSlice.reducer;
export default authReducer;