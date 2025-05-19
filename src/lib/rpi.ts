export function computeRpi(severity:number, occurrence:number, detection:number){
  return severity * occurrence * detection;
}