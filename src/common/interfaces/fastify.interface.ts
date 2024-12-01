import { FastifyRequest } from 'fastify';
import { PaginateQueryDTO } from '../dto/paginate-query.dto';
import { UserDocument } from 'src/domain/user/schemas/user.schema';

export default interface CustomFastifyRequest<T = unknown>
  extends FastifyRequest {
  user: UserDocument;
  query: PaginateQueryDTO<T>;
}
