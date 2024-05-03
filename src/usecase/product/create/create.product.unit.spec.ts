import ProductFactory from "../../../domain/product/factory/product.factory";
import { CreateProductUseCase } from "./create.product.usecase";

const input = {
  name: "Shirt",
  price: 10,
};
const product = ProductFactory.createNewProduct(input.name, input.price);

const MockRepository = () => {
  return {
    create: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  };
};

describe("Unit test create product use case", () => {
  it("should create a product", async () => {
    const repository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(repository);

    const output = await createProductUseCase.execute({
      name: input.name,
      price: input.price,
    });

    expect(output.id).toBeTruthy();
    expect(output.name).toEqual(product.name);
    expect(output.price).toEqual(product.price);
  });
});
