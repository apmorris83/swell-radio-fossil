import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'view',
  initialState: {
    years: [
      { text: '2020', value: 2020 },
      { text: '2019', value: 2019 }
    ],
    months: [
      { text: 'January', value: 0 },
      { text: 'February', value: 1 },
      { text: 'March', value: 2 },
      { text: 'April', value: 3 },
      { text: 'May', value: 4 },
      { text: 'June', value: 5 },
      { text: 'July', value: 6 },
      { text: 'August', value: 7 },
      { text: 'September', value: 8 },
      { text: 'October', value: 9 },
      { text: 'November', value: 10 },
      { text: 'December', value: 11 }
    ],
    sections: [
      { text: 'Car', value: 'car' },
      { text: 'Van', value: 'van' },
      { text: 'Truck', value: 'truck' }
    ],
    selected: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      sections: []
    },
    fetchingSpends: false,
    data: false
  },
  reducers: {
    selectYear: (state, action) => {
      state.selected.year = action.payload;
    },
    selectMonth: (state, action) => {
      state.selected.month = action.payload;
    },
    selectSection: (state, action) => {
      state.selected.sections = action.payload;
    },
    fetchingData: state => {
      state.fetchingSpends = true;
      state.data = false;
    },
    fetchedData: state => {
      state.fetchingSpends = false;
      state.data = true;
    }
  }
});

export const {
  selectYear,
  selectMonth,
  selectSection,
  fetchingData,
  fetchedData
} = slice.actions;

export const fetchSpends = selected => dispatch => {
  dispatch(fetchingData());
  setTimeout(() => {
    console.log('fetch data with this query: ', selected);
    dispatch(fetchedData());
  }, 1000);
};

export default slice.reducer;
