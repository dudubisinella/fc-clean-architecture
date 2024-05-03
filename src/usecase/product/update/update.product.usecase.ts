import { validate } from "uuid";

import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";

export class UpdateProductUseCase {
  private productRepository: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
    const { id, name, price } = input;

    const IdIsInvalid = !validate(id);

    if (IdIsInvalid) {
      throw new Error("Invalid product id");
    }

    const product = await this.productRepository.find(id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (name) {
      product.changeName(name);
    }

    if (price) {
      product.changePrice(price);
    }

    await this.productRepository.update(product);

    const outputDto: OutputUpdateProductDto = product.toJSON();
    return outputDto;
  }
}
