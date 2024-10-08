import { createStore, combineReducers } from "redux";
import cartReducer from "../Reducer/CartReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
});

const store = createStore(rootReducer);

export default store;
