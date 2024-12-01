import { CustomController } from 'src/common/decorators/controller.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import ResourceController from 'src/common/resources/resource-controller';
import { DiscountService } from './discount.service';
import { Discount } from './schemas/discount.schema';

@CustomController({
  apiTag: 'Discount',
  path: 'discount',
  auth: true,
  roles: [ROLES.ADMIN],
})
export class DiscountController extends ResourceController({
  schema: Discount,
  service: DiscountService,
}) {
  constructor(private readonly discountService: DiscountService) {
    super(discountService);
  }
}
