// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = await getCustomRepository(
      TransactionsRepository,
    );

    const data = {
      title,
      value,
      type,
      category_id: 0,
    };

    const repositoryCategory = await getRepository(Category);

    const checkCategoryExists = await repositoryCategory.findOne({
      where: { title: category },
    });

    if (checkCategoryExists) {
      // const idCategory = checkCategoryExists.id;
      data.category_id = 1;
    } else {
      // const newCategory = await repositoryCategory.create({ title: category });
      // await repositoryCategory.save(newCategory);

      data.category_id = 1;
    }

    const transaction = await transactionsRepository.create(data);

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
