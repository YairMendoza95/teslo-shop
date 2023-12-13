export { ProductImage } from "./product-image.entity";
export { Product } from "./product.entity";

// Como estas entidades tienen relación entre sí y no se generó un CRUD único para la entidad ProductImage, se puede crear un archivo de barril (index.ts), donde se exporten las entidades
