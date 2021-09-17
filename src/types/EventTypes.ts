export type stringOrDate = string | Date;

export type dataObj = {
  title: string,
  description: string,
  start: string | Date,
  end: string | Date,
  userId?: string | null | undefined
}

export type CalendarProps = {
  onLocale: string,
  userId: number | null | undefined,
  username: string | null
};

export type SelectEventType = {
  title: string,
  description: string,
  id: number,
  action?: 'select',
  start: Date,
  end: Date,
  users?: any,
  confirmed: Boolean,
  username?: string | undefined,
}

export type SlotInfo = {
  start: stringOrDate;
  end: stringOrDate;
  slots: Date[] | string[];
  action: 'select' | 'click' | 'doubleClick';
}


export type TNewDetail = {
  start: Date,
  end: Date
}

export type detailEventIn = {
  title: string,
  description: string,
  id: number,
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