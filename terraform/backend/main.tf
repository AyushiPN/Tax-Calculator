provider "aws" {
  region = "eu-west-1"
}

data "aws_ecr_repository" "tax_calc_proxy" {
  name = "tax-calc-proxy"  # Existing ECR repository name
}

resource "aws_ecs_cluster" "backend_cluster" {
  name = "backend_ecs-cluster"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = "your_execution_role_arn"  # Replace with your execution role ARN

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
    subnets = ["subnet-0003d5ada12f964ca"]  # No subnets needed for Fargate without VPC
    security_groups = ["sg-0737d50b02c59bbad"]  # No security groups needed for Fargate without VPC
    assign_public_ip = true
  }
}

output "public_ip" {
  value = aws_ecs_service.backend_service.eni_ids[0]  # Assuming there is only one ENI, adjust accordingly
}
