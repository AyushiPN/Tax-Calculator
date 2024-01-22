provider "aws" {
  region = "eu-west-1"
}

data "aws_ecr_repository" "tax_calc_proxy" {
  name = "tax-calc-proxy"  # Existing ECR repository name
}

resource "aws_iam_role" "backend_execution_role" {
  name = "backend-execution-role"
  
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

resource "aws_ecs_cluster" "backend_cluster" {
  name = "backend-cluster"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.backend_execution_role.arn  # Specify execution role ARN

  cpu     = "256"   # Set the desired CPU units
  memory  = "512"   # Set the desired memory in MiB

  container_definitions = jsonencode([{
    name      = "backend-container",
    image     = "${data.aws_ecr_repository.tax_calc_proxy.repository_url}:latest",
    cpu       = 256,
    memory    = 512,
    essential = true,
  }])
}

resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["subnet-0003d5ada12f964ca"]
    security_groups = ["sg-0737d50b02c59bbad"]
    assign_public_ip = "true"
  }
}
