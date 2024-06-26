import { Sequelize } from "sequelize-typescript";

import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import { FindProductUseCase } from "./find.product.usecase";

describe("Integration Test find product use case", () => {
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

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const useCase = new FindProductUseCase(productRepository);

    const inputCreate = {
      name: "Shirt",
      price: 10,
    };
    const product = ProductFactory.createNewProduct(
      inputCreate.name,
      inputCreate.price
    );

    await productRepository.create(product);

    const input: InputFindProductDto = {
      id: product.id,
    };

    const expectedOutput: OutputFindProductDto = {
      id: product.id,
      name: product.name,
      price: product.price,
    };

    const result = await useCase.execute(input);
    expect(result).toEqual(expectedOutput);
  });
});
