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
      pageTotal: 0,
      pageAverage: 0,
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
      state.history.pageTotal = action.payload.reduce((acc, cur) => acc + cur.amount, 0);
    },
    fetchSpendEntries: (state, action) => {
      state.spends.entries = action.payload;
      state.spends.pageTotal = action.payload.reduce((acc, cur) => acc + cur.total, 0);
      state.spends.pageAverage = action.payload.reduce((acc, cur) => acc + cur.average, 0);
    },
    clearAdd: (state) => {
      state.add.selected.amount = '';
      state.add.selected.note = '';
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
  fetchSpendEntries,
  clearAdd,
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
  if (selected.month !== null && selected.year && selected.section && selected.row) dispatch(fetchingHistoryEntries(selected));
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
      if (!getState().global.add.selected.section) dispatch(selectingSection({ section: selectedSection, page: 'add' })); // fetch section/row for Add
    } catch (error) {
      console.log(error);
    }
  }
  if (selected.month !== null && selected.year) dispatch(fetchingSpendsEntries(selected));
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
        if (selected.page !== 'spends') {
          data.forEach((doc) => rows.push({ text: doc.data().title, value: doc.id }));
          dispatch(fetchRows({ page: selected.page, rows: rows }));
          return rows[0].value;
        }
      });
    dispatch(selectSection({ page: selected.page, section: selected.page === 'spends' ? [selected.section] : selected.section })); // 'spends'
    if (selected.page !== 'spends') dispatch(selectRow({ page: selected.page, row: selectedRow })); // not needed for spends
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
      dispatch(clearAdd());
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

export const fetchingSpendsEntries = (selected) => async (dispatch, getState) => {
  const { sections } = getState().global;

  const getAsyncSpendData = async (ID) => {
    const entriesQuery =
      selected.month === 'all'
        ? firestoreEntries.where('year', '==', selected.year).where('section', '==', ID)
        : firestoreEntries.where('year', '==', selected.year).where('month', '==', selected.month).where('section', '==', ID);

    const sectionTotal = await entriesQuery.get().then((data) => {
      let sectionAmount = [];
      data.forEach((doc) => sectionAmount.push(doc.data().amount));
      return sectionAmount.reduce((a, b) => a + b, 0);
    });

    const sectionRows = await firestoreRows // get the rows and totals
      .where('section', '==', ID)
      .get()
      .then((data) => {
        let rows = [];
        data.forEach((doc) => rows.push({ text: doc.data().title, value: doc.id }));

        const getAsyncRowData = async (row) => {
          const entriesQuery =
            selected.month === 'all'
              ? firestoreEntries.where('year', '==', selected.year).where('row', '==', row.value)
              : firestoreEntries.where('year', '==', selected.year).where('month', '==', selected.month).where('row', '==', row.value);
          return await entriesQuery.get().then((data) => {
            let rowAmount = [];
            data.forEach((doc) => rowAmount.push(doc.data().amount));
            const rowTotal = rowAmount.reduce((a, b) => a + b, 0);
            return {
              text: row.text,
              total: rowTotal,
              average: rowTotal / 12,
            };
          });
        };

        const getRowData = () => Promise.all(rows.map((row) => getAsyncRowData(row))); // async map to get the row totals
        const rowTotal = getRowData().then((data) => data); // wait for Promise.all to resolve
        return rowTotal;
      });
    return {
      text: sections.find((s) => s.value === ID).text,
      total: sectionTotal,
      average: sectionTotal / 12,
      rows: sectionRows,
    };
  };

  const getSpendsData = () => Promise.all(selected.sections.map((sectionID) => getAsyncSpendData(sectionID))); // wait for all async stuff to resolve
  getSpendsData().then((data) => dispatch(fetchSpendEntries(data))); // wait for Promise.all to resolve;
};

export const selectShowAdd = (state) => state.add.showAdd;

export default slice.reducer;

/*
TODO edit entry
TODO delete entry
 */
