provider "aws" {
  region = "eu-west-1"
}

data "aws_ecr_repository" "tax_calc_proxy" {
  name = "tax-calc-proxy"  # Existing ECR repository name
}

resource "aws_iam_role" "frontend_execution_role" {
  name = "frontend-execution-role"
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

resource "aws_ecs_cluster" "frontend_cluster" {
  name = "frontend-cluster"
}

resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.frontend_execution_role.arn  # Specify execution role ARN

  cpu     = "256"   # Set the desired CPU units
  memory  = "512"   # Set the desired memory in MiB

  container_definitions = jsonencode([{
    name      = "frontend-container",
    image     = "${data.aws_ecr_repository.tax_calc_proxy.repository_url}:latest",
    cpu       = 256,
    memory    = 512,
    essential = true,
  }])
}

resource "aws_lb_target_group" "frontend_target_group" {
  name        = "frontend-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = "vpc-02f68a4241ae8c12e"
  target_type = "ip"  # Assuming your tasks have IPs
}

resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.frontend_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["subnet-0003d5ada12f964ca"]
    security_groups = ["sg-0737d50b02c59bbad"]
    assign_public_ip = "true"
  }

    load_balancer {
    target_group_arn = aws_lb_target_group.frontend_target_group.arn
    container_name   = "frontend-container"
    container_port   = 80  # Assuming your container listens on port 80
  }
}
