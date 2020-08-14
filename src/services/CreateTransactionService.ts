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
    let categoryId: string;

    const transactionsRepository = await getCustomRepository(
      TransactionsRepository,
    );

    const repositoryCategory = await getRepository(Category);

    const checkCategoryExists = await repositoryCategory.findOne({
      where: { title: category },
    });

    if (checkCategoryExists) {
      categoryId = checkCategoryExists.id;
    } else {
      const newCategory = await repositoryCategory.create({ title: category });
      await repositoryCategory.save(newCategory);
      categoryId = newCategory.id;
    }

    const transaction = await transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
