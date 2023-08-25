import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Put,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateService } from './update.service';
import  { Response , Request} from 'express';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';
import { AuthGuard } from '@nestjs/passport';


@Controller('update')
@UseGuards(AuthGuard('authGuard'))
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}
  @Get(':id')
  @UseGuards(PermissionGuard)
  getOneUser(@Param('id') id: string,@Req() req: Request): any {
    id = req.user['id'];
    return this.updateService
      .getOneUser(+id)
      .then((data) => {
        return data;
      })
      .catch((err) => {
       throw err;
      });
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  async update(
    @Param('id') id: number,
    @Query('username') username: string,
    @Query('firstname') firstname: string,
    @Query('lastname') lastname: string,
    @Query('bio') bio: string,
    @Query('avatar') avatar: string,
    @Query('cover') cover: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
   
    try {
      id = parseInt(req.user['id']);
      const data = await this.updateService.updateUser(
        +id,
        username,
        firstname,
        lastname,
        bio,
        avatar,
        cover,
      ); 
      if (data) res.clearCookie('firstTime');
      return res.send(data ? ' update' : 'no');
    } catch (error) {
      throw error;
    }
  }
}
