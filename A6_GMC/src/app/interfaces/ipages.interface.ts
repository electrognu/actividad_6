import { Iuser } from "./iuser.interface";

export interface Ipages {
    "page": number,
    "per_page": number,
    "total": number,
    "total_pages": number,
    "results": [Iuser]
}
