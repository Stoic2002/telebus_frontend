// To parse this data:
//
//   import { Convert, UserModel } from "./file";
//
//   const userModel = Convert.toUserModel(json);

export interface PJTWaterLevel {
    Waterlevel: Waterlevel[];
}

export interface Waterlevel {
    header: Header;
    data:   Datum[];
}

export interface Datum {
    datetime: string;
    wl:       string;
}

export interface Header {
    name: string;
    x:    string;
    y:    string;
}

// Converts JSON strings to/from your types
// export class Convert {
//     public static toUserModel(json: string): PJTwaterLevel {
//         return JSON.parse(json);
//     }

//     public static userModelToJson(value: PJTwaterLevel): string {
//         return JSON.stringify(value);
//     }
// }

// To parse this data:
//
//   import { Convert, UserModel } from "./file";
//
//   const userModel = Convert.toUserModel(json);

export interface PJTRainFall
 {
    Rainfall: Rainfall[];
}

export interface Rainfall {
    header: Header;
    data:   Datum[];
}

export interface Datum {
    datetime: string;
    rf:       RF;
}

export enum RF {
    Empty = "-",
    The000 = "0.00",
    The020 = "0.20",
    The040 = "0.40",
    The060 = "0.60",
    The080 = "0.80",
    The120 = "1.20",
    The1200 = "12.00",
    The160 = "1.60",
    The280 = "2.80",
}

export interface Header {
    name: string;
    x:    string;
    y:    string;
}

// Converts JSON strings to/from your types
// export class Convert {
//     public static toUserModel(json: string): UserModel {
//         return JSON.parse(json);
//     }

//     public static userModelToJson(value: UserModel): string {
//         return JSON.stringify(value);
//     }
// }
