import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private eventsGateWay: EventsGateway,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}
  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    // Log the incoming DTO to debug the data being received
    this.logger.debug(
      `Creating message with data: ${JSON.stringify(createMessageDto)}`,
    );

    // Check if userId is present and not null
    if (!createMessageDto.userId) {
      throw new Error('userId is missing or null');
    }

    // Create and save the message entity
    const makeMessage = this.messageRepository.create(createMessageDto);
    const createdMessage = await this.messageRepository.save(makeMessage);

    // Log the created message
    this.logger.debug(`Message created: ${JSON.stringify(createdMessage)}`);

    // Notify via the events gateway
    this.eventsGateWay.sendMessage(createdMessage);

    return createdMessage;
  }

  findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
