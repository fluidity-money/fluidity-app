// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

export const formatTo12HrDate = (date: Date) => {
  const dateDate = `${date.getDate()}`.padStart(2, '0');
  const dateMonth = `${date.getMonth() + 1}`.padStart(2, '0');
  const dateYear = `${date.getFullYear() % 100}`.padStart(2, '0');
  const date24Hr = date.getHours();
  const date12Hr = `${date24Hr === 0 ? 0 : ((date24Hr % 12) || 12)}`.padStart(2, '0');
  const dateMin = `${date.getMinutes()}`.padStart(2, '0');
  const dateAmPm = date24Hr < 12 ? "am" : "pm";
  
  return `${dateDate}.${dateMonth}.${dateYear} ${date12Hr}:${dateMin}${dateAmPm}`;
}

export const formatToGraphQLDate = (date: Date) => {
  const dateDate = `${date.getDate()}`.padStart(2, '0');
  const dateMonth = `${date.getMonth() + 1}`.padStart(2, '0');
  const dateFullYear = date.getFullYear();
  
  return `${dateFullYear}-${dateMonth}-${dateDate}`;
}
