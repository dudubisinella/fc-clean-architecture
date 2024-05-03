import { Sequelize } from "sequelize-typescript";

import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
import { UpdateProductUseCase } from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Integration Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const useCase = new UpdateProductUseCase(productRepository);

    const input1 = {
      name: "Shirt",
      price: 10,
    };
    const product1 = ProductFactory.createNewProduct(input1.name, input1.price);

    await productRepository.create(product1);

    const input: InputUpdateProductDto = {
      id: product1.id,
      name: "Shirt Updated",
      price: 20,
    };

    const expectedOutput: OutputUpdateProductDto = {
      id: product1.id,
      name: "Shirt Updated",
      price: 20,
    };

    const result = await useCase.execute(input);
    expect(result).toEqual(expectedOutput);
  });
});
