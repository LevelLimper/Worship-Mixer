import RequestGrid from '../RequestGrid'

export default function RequestGridExample() {
  sessionStorage.setItem("requesterName", "John");
  return <RequestGrid />
}
