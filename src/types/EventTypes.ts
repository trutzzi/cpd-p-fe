export type dataObj = {
  title: string,
  description: string,
  start: string | Date,
  end: string | Date,
  userId?: number | null | undefined
}

export type CalendarProps = {
  onLocale: string,
  userId: number | null | undefined,
  username: number | null
};

export type TOnSelectItem = {
  title: string,
  description: string,
  start: Date,
  end: Date,
  users: any
}

export type TNewDetail = {
  start: Date,
  end: Date
}

export type detailEventIn = {
  title: string,
  description: string,
  start: Date,
  end: Date,
  username: any
}

export type NewDetailT = {
  open: boolean,
  startDate: string | Date,
  endDate: string | Date,
  OpenDetailClose: () => void,
  onNewEvent: (data: dataObj) => Promise<void>,
}