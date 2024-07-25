import { obj } from '../types/type'

export const stringifyObject = (obj: obj): string => {
  return JSON.stringify(obj)
}

export const parseObject = (objStr: string): object => {
  return JSON.parse(objStr)
}

export const getLocalStorage = (key: string): object => {
  if (localStorage.getItem(key)) {
    return parseObject(localStorage.getItem(key) as string)
  } else {
    return {}
  }
}

export const setLocalStorage = (key: string, obj: obj): void => {
  const oldObj = getLocalStorage(key)
  localStorage.setItem(key, stringifyObject({ ...oldObj, ...obj }))
}

export const secondsToHms = (sec: number): string => {
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = sec % 60
  return [
    hours < 10 ? '0' + hours : hours,
    minutes < 10 ? '0' + minutes : minutes,
    ('0' + seconds).slice(-2)
  ].join(':')
}
