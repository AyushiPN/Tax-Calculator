provider "aws" {
  region = "eu-west-1"
}

data "aws_ecr_repository" "tax_calc_proxy" {
  name = "tax-calc-proxy"  # Existing ECR repository name
}

resource "aws_iam_role" "frontend_execution_role" {
  name = "frontend_execution-role"

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
  security_groups    = ["sg-0737d50b02c59bbad"]
  subnets            = ["subnet-0003d5ada12f964ca", "subnet-0f03be6d1bd126130"]  # Specify your subnets here in different AZs
}

resource "aws_lb_target_group" "frontend_target_group" {
  name     = "frontend-target-group"
  port     = 5173
  protocol = "HTTP"
  vpc_id   = "vpc-02f68a4241ae8c12e"
  target_type = "ip"
}

resource "aws_lb_listener" "frontend_listener" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.frontend_target_group.arn
    type             = "forward"
  }
}

resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.frontend_execution_role.arn

  cpu     = "256"
  memory  = "512"

  container_definitions = jsonencode([{
    name      = "frontend-container",
    image     = "${data.aws_ecr_repository.tax_calc_proxy.repository_url}:latest",
    cpu       = 256,
    memory    = 512,
    essential = true,
    portMappings = [{
      containerPort = 5173,
      hostPort      = 5173,
    }],
  }])
}

resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         =  ["subnet-0003d5ada12f964ca", "subnet-0f03be6d1bd126130"]  # Specify your subnets here in different AZs
    security_groups = ["sg-0737d50b02c59bbad"]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_target_group.arn
    container_name   = "frontend-container"
    container_port   = 5173
  }
}
