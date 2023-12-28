import { ExecutionContext, createParamDecorator, InternalServerErrorException } from '@nestjs/common';

// Los custom decorators nos ayudan a tener un código más limpio, y en este caso nos ayuda a obtener el nombre sin pasar por la request
export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    // El contexto es como se encuentra la aplicación en ese momento
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new InternalServerErrorException('User not found');

    return !data ? user : user[data];
});


// Los estatus 500 son errores del propio programador
