provider "aws" {
  region = "eu-west-1"
}

data "aws_ecr_repository" "tax_calc_proxy" {
  name = "tax-calc-proxy"  # Existing ECR repository name
}

resource "aws_vpc" "tax_calc_vpc" {
  cidr_block = "10.1.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "tax_calc_vpc"
  }
}

resource "aws_internet_gateway" "tax_calc_gateway" {
  vpc_id = aws_vpc.tax_calc_vpc.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.tax_calc_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.tax_calc_gateway.id
  }
}

resource "aws_subnet" "tax_calc_vpc_1" {
  vpc_id                  = aws_vpc.tax_calc_vpc.id
  cidr_block              = "10.1.1.0/24"
  availability_zone       = "eu-west-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "tax-calc-1"
  }
}

resource "aws_route_table_association" "tax_calc_vpc_1" {
  subnet_id      = aws_subnet.tax_calc_vpc_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_subnet" "tax_calc_vpc_2" {
  vpc_id                  = aws_vpc.tax_calc_vpc.id
  cidr_block              = "10.1.2.0/24"
  availability_zone       = "eu-west-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "tax-calc-2"
  }
}

resource "aws_route_table_association" "tax_calc_vpc_2" {
  subnet_id      = aws_subnet.tax_calc_vpc_2.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "tax_calc_security_group" {
  name        = "tax-calc-sg"
  description = "Security group for tax-calc VPC"
  vpc_id      = aws_vpc.tax_calc_vpc.id
  ingress {
    from_port = 3000
    to_port   = 3000
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

}



resource "aws_iam_role" "backend_execution_role" {
  name = "backend_execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com",
      },
    }],
  })
}

resource "aws_ecs_cluster" "cluster" {
  name = "ecs-cluster"
}

resource "aws_lb" "load_balancer" {
  name               = "ecs-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.tax_calc_security_group.id]
  subnets            = [aws_subnet.tax_calc_vpc_1.id, aws_subnet.tax_calc_vpc_2.id]  # Specify your subnets here in different AZs
}

resource "aws_lb_target_group" "backend_target_group" {
  name     = "backend-target-group"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.tax_calc_vpc.id
  target_type = "ip"
}

resource "aws_lb_listener" "backend_listener" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.backend_target_group.arn
    type             = "forward"
  }
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.backend_execution_role.arn

  cpu     = "256"
  memory  = "512"

  container_definitions = jsonencode([{
    name      = "backend-container",
    image     = "${data.aws_ecr_repository.tax_calc_proxy.repository_url}:latest",
    cpu       = 256,
    memory    = 512,
    essential = true,
    portMappings = [{
      containerPort = 3000,
      hostPort      = 3000,
    }],
  }])
}

resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         =  [aws_subnet.tax_calc_vpc_1.id, aws_subnet.tax_calc_vpc_2.id]   # Specify your subnets here in different AZs
    security_groups = [aws_security_group.tax_calc_security_group.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_target_group.arn
    container_name   = "backend-container"
    container_port   = 3000
  }
}

resource "aws_lb_target_group_attachment" "backend_lb_target_group" {
  target_group_arn = aws_lb_target_group.backend_target_group.arn
  target_id        = aws_ecs_service.backend_service.name
}
