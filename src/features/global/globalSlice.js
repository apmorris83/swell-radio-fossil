import { createSlice } from '@reduxjs/toolkit';
import firebase from '../../firebase.js';

const db = firebase.firestore();
const firestoreSections = db.collection('sections');
const firestoreRows = db.collection('rows');
const firestoreEntries = db.collection('entries');

export const slice = createSlice({
  name: 'global',
  initialState: {
    showAdd: false,
    loading: false,
    error: false,
    years: [],
    months: [],
    sections: [],
    spends: {
      selected: {
        year: null,
        month: null,
        sections: [],
      },
      entries: [],
    },
    history: {
      selected: {
        year: null,
        month: null,
        section: null,
        row: '',
        rows: [],
      },
      entries: [],
    },
    add: {
      selected: {
        month: null,
        section: null,
        rows: [],
        amount: '',
        note: '',
      },
    },
  },
  reducers: {
    toggleShowAdd: (state) => {
      state.showAdd = !state.showAdd;
    },
    loading: (state) => {
      state.loading = true;
    },
    fetchMonths: (state, action) => {
      state.months = action.payload;
    },
    fetchYears: (state) => {
      const years = [
        { text: '2020', value: 2020 },
        { text: '2019', value: 2019 },
      ];
      const currentYear = new Date().getFullYear();
      const yearDiff = currentYear - years[0].value;
      state.years = years;
    },
    fetchSections: (state, action) => {
      state.sections = action.payload;
    },
    fetchRows: (state, action) => {
      state[action.payload.page].selected.rows = action.payload.rows.sort((a, b) => {
        return a.text > b.text ? 1 : a.text < b.text ? -1 : 0;
      });
    },
    selectSection: (state, action) => {
      if (action.payload.page === 'spends') state[action.payload.page].selected.sections = action.payload.section;
      else state[action.payload.page].selected.section = action.payload.section;
    },
    selectRow: (state, action) => {
      state[action.payload.page].selected.row = action.payload.row;
    },
    selectYear: (state, action) => {
      state[action.payload.page].selected.year = action.payload.year;
    },
    selectMonth: (state, action) => {
      state[action.payload.page].selected.month = action.payload.month;
    },
    updateAmount: (state, action) => {
      state.add.selected.amount = action.payload;
    },
    updateNote: (state, action) => {
      state.add.selected.note = action.payload;
    },
    fetchHistoryEntries: (state, action) => {
      state.history.entries = action.payload.sort((a, b) => {
        return a.month === b.month ? b.created - a.created : a.month > b.month ? 1 : -1;
      });
    },
  },
});

export const {
  toggleShowAdd,
  loading,
  fetchMonths,
  fetchYears,
  fetchSections,
  fetchRows,
  selectSection,
  selectRow,
  selectYear,
  selectMonth,
  updateAmount,
  updateNote,
  fetchHistoryEntries,
} = slice.actions;

export const loadHistory = (selected) => async (dispatch, getState) => {
  if (selected.month === null && selected.year === null && selected.section === null) {
    try {
      const selectedSection = await firestoreSections
        .orderBy('title')
        .get()
        .then((data) => {
          let sections = [];
          data.forEach((doc) => sections.push({ text: doc.data().title, value: doc.id }));
          dispatch(fetchSections(sections));
          dispatch(fetchingMonths('history'));
          dispatch(fetchingYears('history'));
          return sections[0].value;
        });
      dispatch(selectingSection({ section: selectedSection, page: 'history' }));
      if (!getState().global.add.selected.section) dispatch(selectingSection({ section: selectedSection, page: 'add' }));
    } catch (error) {
      console.log(error);
    }
  }
  if (selected.month && selected.year && selected.section && selected.row) dispatch(fetchingHistoryEntries(selected));
};

export const loadSpends = (selected) => async (dispatch, getState) => {
  if (selected.month === null && selected.year === null && selected.sections.length === 0) {
    try {
      const selectedSection = await firestoreSections
        .orderBy('title')
        .get()
        .then((data) => {
          let sections = [];
          data.forEach((doc) => sections.push({ text: doc.data().title, value: doc.id }));
          dispatch(fetchSections(sections));
          dispatch(fetchingMonths('spends'));
          dispatch(fetchingYears('spends'));
          return sections[0].value;
        });
      dispatch(selectingSection({ section: selectedSection, page: 'spends' }));
      if (!getState().global.add.selected.section) dispatch(selectingSection({ section: selectedSection, page: 'add' }));
    } catch (error) {
      console.log(error);
    }
  }
  if (selected.month && selected.year && selected.sections) dispatch(fetchingSpendsEntries(selected));
};

export const loadAdd = (selected) => async (dispatch) => {
  if (selected.month === null && selected.section === null) {
    dispatch(selectMonth({ page: 'add', month: new Date().getMonth() }));
  }
};

export const fetchingYears = (page) => (dispatch) => {
  dispatch(fetchYears());
  dispatch(selectYear({ page: page, year: new Date().getFullYear() }));
};

export const fetchingMonths = (page) => (dispatch) => {
  const months = [
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
    { text: 'December', value: 11 },
  ];
  const res = ['spends', 'history'].indexOf(page) > -1 ? [{ text: 'All', value: 'all' }, ...months] : months;
  dispatch(fetchMonths(res));
  dispatch(selectMonth({ page: page, month: new Date().getMonth() }));
};

export const fetchingSections = (page) => async (dispatch) => {
  try {
    const selectedSection = await firestoreSections
      .orderBy('title')
      .get()
      .then((data) => {
        let sections = [];
        data.forEach((doc) => sections.push({ text: doc.data().title, value: doc.id }));
        dispatch(fetchSections(sections));
        return sections[0].value;
      });
    dispatch(selectingSection({ section: selectedSection, page: page }));
  } catch (error) {
    console.log(error);
  }
};

export const selectingSection = (selected) => async (dispatch) => {
  try {
    const selectedRow = await firestoreRows
      .where('section', '==', selected.section)
      .get()
      .then((data) => {
        let rows = [];
        data.forEach((doc) => rows.push({ text: doc.data().title, value: doc.id }));
        dispatch(fetchRows({ page: selected.page, rows: rows }));
        return rows[0].value;
      });
    dispatch(selectSection({ page: selected.page, section: selected.page === 'spends' ? [selected.section] : selected.section })); // 'spends'
    dispatch(selectRow({ page: selected.page, row: selectedRow })); // not needed for spends
  } catch (error) {
    console.log(error);
  }
};

export const addSpend = (location) => async (dispatch, getState) => {
  const { selected } = getState().global.add;
  const data = {
    amount: Number(selected.amount),
    created: Date.now(),
    month: selected.month,
    note: selected.note,
    row: selected.row,
    section: selected.section,
    year: new Date().getFullYear(),
  };
  try {
    firestoreEntries.add(data).then(() => {
      dispatch(toggleShowAdd());
      dispatch(fetchingHistoryEntries(data));
      // if (location === '/history') dispatch(onFetchHistory()); // fetch history again
      // dispatch(loaded());
    });
  } catch (error) {
    console.log(error);
    // dispatch(loaded());
  }
};

export const fetchingHistoryEntries = (selected) => async (dispatch) => {
  try {
    const query =
      selected.month === 'all'
        ? firestoreEntries.where('year', '==', selected.year).where('section', '==', selected.section).where('row', '==', selected.row)
        : firestoreEntries.where('year', '==', selected.year).where('month', '==', selected.month).where('section', '==', selected.section).where('row', '==', selected.row);
    await query.get().then((data) => {
      let entries = [];
      data.forEach((doc) => entries.push({ ...doc.data() }));
      dispatch(fetchHistoryEntries(entries));
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchingSpendsEntries = (selected) => async (dispatch) => {
  // selected.sections
  // need to map over these and fetch all data for each section
  try {
    const query =
      selected.month === 'all'
        ? firestoreEntries.where('year', '==', selected.year).where('section', '==', selected.section)
        : firestoreEntries.where('year', '==', selected.year).where('month', '==', selected.month).where('section', '==', selected.section);
    await query.get().then((data) => {
      let entries = [];
      data.forEach((doc) => entries.push({ ...doc.data() }));
      dispatch(fetchHistoryEntries(entries));
    });
  } catch (error) {
    console.log(error);
  }
};

export const selectShowAdd = (state) => state.add.showAdd;

export default slice.reducer;
