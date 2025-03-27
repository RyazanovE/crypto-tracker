import { PortfolioService } from './portfolio.service';
import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
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

  @Get()
  getPortfolio(@Req() req) {
    return this.portfolioService.getPortfolioWithCoins(req.user.id);
  }
  
  @Post('remove-coin')
  async removeCoinFromPortfolio(@Req() req, @Body() dto: { id: number }) {
    return this.portfolioService.removeCoinFromPortfolio(req.user.id, dto.id);
  }
}
