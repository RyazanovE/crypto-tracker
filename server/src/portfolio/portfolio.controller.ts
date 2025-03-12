import { PortfolioService } from './portfolio.service';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreatePortfolioDtoType, CreatePortfolioSchema } from './dto/create-portfolio.dto';
import { PortfolioValidationPipe } from './pipes/portfolio-validation-pipe';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Post()
  @UsePipes(new PortfolioValidationPipe(CreatePortfolioSchema))
  create(@Body() dto: CreatePortfolioDtoType) {
    return this.portfolioService.create(dto);
  }
}
