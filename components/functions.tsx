type Search = {title:string, text:string, start:number, end:number, url:string}

export const ReplaceTitle=(title:string)=>{
    title=title.replaceAll("ï½œ","-")
    title=title.replaceAll("ï¼š",":")
    return title
  }
  
export const secondsToHour = (seconds:number) => {
    const hours:number = Math.floor(seconds / 3600)
    const minutes:number = Math.floor((seconds - (hours * 3600)) / 60)
    const sec:number = seconds - (hours * 3600) - (minutes * 60)
  
    const paddedMinutes: string = minutes > 9 ? String(minutes) : `0${minutes}`
    const paddedSec: string = sec > 9 ? String(sec) : `0${sec}`
  
    return hours + ":" + paddedMinutes  + ":" + paddedSec
  }
  