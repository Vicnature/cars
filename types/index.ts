import { MouseEventHandler } from "react";

export interface CustomButtonProps{
    title:string;
    containerStyles?:string;
    handleClick?:MouseEventHandler<HTMLButtonElement>;
    btnType?:"button" | "submit";
    textStyles?:string;
    rightIcon?:string;
    isDisabled?:boolean;
}

export interface searchManufacturerProps{
    selected:string;
    setSelected:(selected:string)=>void
}

export interface carProps{
    city_mpg:number;
    class:string;
    combination_mpg:number;
    cylinders:number;
    displacement:number;
    drive:string;
    fuel_type:string;
    highway_mpg:number;
    make:string;
    model:string;
    transmission:string;
    year:number;
}

export interface FilterProps{
    manufacturer:string,
    year:number,
    fuel:string,
    limit:number,
    model:string,
}

export interface OptionProps{
    title:string;
    value:string;
}

export  interface CustomFilterProps{
    title:string,
    options:OptionProps[]
    setFilter:any
}

export interface ShowMoreProps{
    pageNumber:number,
    isNext:boolean
    setLimit:any
}

export interface HomeProps {
    searchParams: FilterProps;
  }
export interface PageProps {
    setManufacturer:any,
    setModel:any
  }

  export interface Order {
  _id: string;
  customerName: string;
  contact: string;
  quantity: number;
  location: string;
  createdAt: string;
  part?: {
    _id: string;
    title: string;
  };
}
