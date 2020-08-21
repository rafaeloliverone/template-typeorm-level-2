import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(idTransaction: string): Promise<void> {
    const transactionRepository = await getCustomRepository(
      TransactionsRepository,
    );

    const transaction = await transactionRepository.findOne(idTransaction);

    if (transaction) {
      await transactionRepository.delete({
        id: idTransaction,
      });
    } else {
      throw new AppError('Not found transaction with this id', 404);
    }
  }
}

export default DeleteTransactionService;
