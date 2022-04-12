export interface IProduct {
    _id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: SizesType[];
    slug: string;
    tags: string[];
    title: string;
    type: TypesType;
    gender: 'men'|'women'|'kid'|'unisex'
}

export type SizesType = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type TypesType = 'shirts'|'pants'|'hoodies'|'hats';