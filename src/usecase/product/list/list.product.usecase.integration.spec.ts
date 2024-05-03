import { Sequelize } from "sequelize-typescript";

import {
  InputListProductsDto,
  OutputListProductsDto,
} from "./list.product.dto";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { ListProductsUseCase } from "./list.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Integration Test list product use case", () => {
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

  it("should list products", async () => {
    const productRepository = new ProductRepository();
    const useCase = new ListProductsUseCase(productRepository);

    const input1 = {
      name: "Shirt",
      price: 10,
    };

    const product1 = ProductFactory.createNewProduct(input1.name, input1.price);

    const input2 = {
      name: "Shirt2",
      price: 5,
    };
    const product2 = ProductFactory.createNewProduct(input2.name, input2.price);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const input: InputListProductsDto = {};

    const expectedOutput: OutputListProductsDto = {
      products: [product1.toJSON(), product2.toJSON()],
    };

    const result = await useCase.execute(input);
    expect(result).toEqual(expectedOutput);
  });
});
