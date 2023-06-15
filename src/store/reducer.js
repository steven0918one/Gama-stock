import { createSlice } from "@reduxjs/toolkit";

export const myReducer = createSlice({
  name: "storeReducer",
  initialState: {
    isLogged: false,
    user: null,
    token: null,
    openMenu: true,
    open: false,
    type: "success",
    message: "",
    project_status: "",
    selected_user: "",
    language: {},
    selectedLang: "german",
    pagination_number: 1,
    reduceQuantities: [],

    // Filters initial values
    isFilterApply: false,
    perPage: 25,
    search: "",
    status: "",
    componentType: "",
    language1: "",
    orderBy: { name: "quantity", order: "desc" },
  },

  reducers: {
    toggleMenu: (state, data) => {
      state.openMenu = data.payload;
    },
    storeUser: (state, data) => {
      state.isLogged = true;
      state.user = data?.payload.user;
    },
    loginUser: (state, data) => {
      localStorage.setItem("@ACCESS_TOKEN", data.payload.access_token);
      state.isLogged = true;
      state.user = data.payload.user;
    },
    registerUser: (state, payload) => {
      state.isLogged = true;
      localStorage.setItem("@ACCESS_TOKEN", payload.token);
      state.user = payload.user;
    },
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.project_status = null;
      state.isLogged = false;
    },
    openPopUp: (state, data) => {
      state.message = data?.payload?.message;
      state.type = data?.payload?.type ?? state.type;
      state.open = true;
    },
    closePopUp: (state, data) => {
      state.open = false;
    },
    Translation: (state, data) => {
      state.language = data?.payload;
    },
    langSetter: (state, data) => {
      localStorage.setItem("language", data.payload);
      state.selectedLang = data.payload;
    },
    setProStatus: (state, data) => {
      state.project_status = data.payload;
      if (data.payload) {
        localStorage.setItem("@Project_Status", data.payload);
      } else {
        localStorage.removeItem("@Project_Status");
      }
    },
    setPaginationCurrent: (state, data) => {
      state.pagination_number = data.payload
    },

    setReduceQuantities: (state, data) => {
      let filtered = state.reduceQuantities.filter(function( obj ) {
        return obj.id !== data.payload.id;
      });
      console.log('filtered :>> ', filtered);
      filtered.push(data.payload);
      state.reduceQuantities = filtered;
      console.log('filtered.push(data) :>> ', filtered);
      console.log('state.reduceQuantities :>> ', state.reduceQuantities);
    },

    //Filters state
    clearFilters: (state, data) => {
      state.perPage = 25;
      state.search = "";
      state.status = "";
      state.language1 = "";
      state.technologies = "";
      state.orderBy = { name: "quantity", order: "desc" };
      state.componentType = "";
    },
    setPerPage: (state, data) => {
      state.perPage = data.payload
    },
    setSearch: (state, data) => {
      state.search = data.payload
    },
    setStatus: (state, data) => {
      state.status = data.payload
    },
    setComponentType: (state, data) => {
      state.componentType = data.payload
    },
    setLanguage: (state, data) => {
      state.language1 = data.payload
    },
    setOrderBy: (state, data) => {
      state.orderBy = {
        name: data?.payload.name,
        order: data?.payload?.order
      }
    },
    setIsFilterApply: (state, data) => {
      state.isFilterApply = data.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  storeUser,
  toggleMenu,
  loginUser,
  registerUser,
  logout,
  closePopUp,
  openPopUp,
  setProStatus,
  Translation,
  langSetter,
  setPaginationCurrent,
  clearFilters,
  setPerPage,
  setSearch,
  setStatus,
  setLanguage,
  setOrderBy,
  setIsFilterApply,
  setComponentType,
  setReduceQuantities
} = myReducer.actions;

export default myReducer.reducer;
